import { supabase } from './supabase';

export const api = {
  get: async (path) => {
    if (path === '/auth/status') {
      const { data: { session } } = await supabase.auth.getSession();
      const { count } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
      return { setupRequired: !session && (count ?? 0) === 0 };
    }
    if (path === '/attendance/me') {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data: settings } = await supabase.from('app_settings').select('*').single();
      const { data: logs, error } = await supabase.from('attendance_records').select('*').eq('user_id', user.id).order('captured_at', { ascending: false }).limit(100);
      if (error) throw error;
      const today = new Date().toISOString().slice(0, 10);
      const rows = (logs || []).filter(x => x.attendance_date === today);
      return {
        radius: settings?.geofence_radius_m ?? 100,
        todayStatus: rows.some(x => x.action === 'CHECK_OUT') ? 'Checked out' : rows.some(x => x.action === 'CHECK_IN') ? 'Checked in' : 'Not checked in',
        state: rows.some(x => x.action === 'CHECK_OUT') ? 'LOCKED' : rows.some(x => x.action === 'CHECK_IN') ? 'CHECK_OUT' : 'CHECK_IN',
        attendanceRate: 0, leaveStatus: 'Active', logs
      };
    }
    throw new Error('Unsupported API route');
  },
  post: async (path, body) => {
    if (path === '/attendance/punch') {
      const { data, error } = await supabase.functions.invoke('attendance', { body: {
        type: body.type, latitude: body.lat, longitude: body.lng, accuracy_m: body.accuracy,
        device_fingerprint: body.device_fingerprint, client_event_id: body.client_event_id, offline: !navigator.onLine
      }});
      if (error) throw error;
      return data;
    }
    throw new Error('Unsupported API route');
  }
};
