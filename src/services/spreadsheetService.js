import supabase from '../supabase';

export const createSpreadsheet = (name) =>
  supabase.from('spreadsheets').insert([{ name }]).select('id');

export const linkUserToSpreadsheet = (spreadsheetId, userId, owner) =>
  supabase.from('users_spreadsheets').insert([{
    spreadsheet_id: spreadsheetId,
    user_id: userId,
    owner,
  }]);

export const getUserSpreadsheets = (userId, owner) =>
  supabase.from('users_spreadsheets')
    .select('spreadsheet_id,spreadsheets (name)')
    .eq('user_id', userId)
    .eq('owner', owner);

export const getSpreadsheetById = (id) =>
  supabase.from('spreadsheets').select('id, name').eq('id', id);

export const renameSpreadsheet = (id, name) =>
  supabase.from('spreadsheets').update({ name }).eq('id', id);

export const deleteSpreadsheet = async (id, userId) => {
  await supabase.from('users_spreadsheets')
    .delete()
    .eq('spreadsheet_id', id);
  return supabase.from('spreadsheets').delete().eq('id', id);
};

export const leaveSpreadsheet = (spreadsheetId, userId) =>
  supabase.from('users_spreadsheets')
    .delete()
    .eq('spreadsheet_id', spreadsheetId)
    .eq('user_id', userId);

export const getSpreadsheetCells = (id) =>
  supabase.from('spreadsheets').select('name, cells').eq('id', id);

export const updateSpreadsheetCells = (id, cells) =>
  supabase.from('spreadsheets')
    .update({ cells: { cells } })
    .eq('id', id);

export const subscribeToSpreadsheet = (id, onUpdate) => {
  const channel = supabase.channel(`cells_channel_${id}`);
  channel.on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'spreadsheets' },
    onUpdate
  );
  channel.subscribe();
  return channel;
};

export const unsubscribeFromSpreadsheet = (channel) => {
  supabase.removeChannel(channel);
};

export const createPresenceChannel = (spreadsheetId, userInfo) => {
  const channel = supabase.channel(`presence_${spreadsheetId}`, {
    config: { presence: { key: userInfo.id } },
  });
  return { channel, userInfo };
};

export const subscribePresence = async ({ channel, userInfo }) => {
  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: userInfo.id,
        email: userInfo.email,
        online_at: new Date().toISOString(),
      });
    }
  });
};

export const leavePresence = (channel) => {
  if (channel) {
    channel.untrack();
    supabase.removeChannel(channel);
  }
};
