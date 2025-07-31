if (not IsFrameworkStarted("qbx")) then return end

local QBX = exports["qb-core"]:GetCoreObject()

if (not QBX) then
    error('\n > Unable to import QBox shared object, please check why this is occuring.\n > This script WILL NOT work until you resolve this.')
    return
end

---Get the player's current bank account balance
---@param src number
---@return integer
local function GetBankBalance(src)
    local qPlayer = QB.Functions.GetPlayer(tonumber(src))

    if not qPlayer then
        return 0
    end

    return qPlayer.Functions.GetMoney("bank") or 0
end

---Remove money from a player's bank account
---@param src number
---@param amount number
---@return boolean success
local function RemoveMoney(src, amount)
    local qPlayer = QB.Functions.GetPlayer(tonumber(src))

    if not qPlayer then
        return false
    end

    qPlayer.Functions.RemoveMoney("bank", math.floor(amount + 0.5), "Funds added to FleecaNow.")

    local balance = GetBankBalance(src)

    if (balance < amount) then
        return false
    end

    return true
end

---Add money to a player's bank account
---@param src number
---@param amount number
---@return boolean success
local function AddMoney(src, amount)
    local qPlayer = QB.Functions.GetPlayer(tonumber(src))

    if not qPlayer or amount < 0 then
        return false
    end

    qPlayer.Functions.AddMoney("bank", math.floor(amount + 0.5), "Funds withdrawn from FleecaNow account.")

    return true
end

exports('GetBankBalance', GetBankBalance)
exports('RemoveMoney', RemoveMoney)
exports('AddMoney', AddMoney)
