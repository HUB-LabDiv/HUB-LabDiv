-- Enable Realtime for messages to allow sidebar and chat to update instantly
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
