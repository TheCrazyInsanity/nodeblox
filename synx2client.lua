repeat wait() until game:IsLoaded() and game.Players and game.Players.LocalPlayer and game.Players.LocalPlayer.Character
local WebSocket = syn.websocket.connect("ws://localhost:123/test") -- Specify your WebSocket URL here.
WebSocket.OnMessage:Connect(function(Msg)
print("connected")
print(Msg)
--Heavy thanks to burkino, i used his program as reference for this part
if Msg == "start" then
print("starting")
script = ""
elseif Msg == "end" then
loadstring(script)()
WebSocket:Send("ok kys")
else
script = script .. Msg
end
end)
wait(2)
WebSocket:Send("ready")
