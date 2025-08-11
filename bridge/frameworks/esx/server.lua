if (not IsFrameworkStarted("esx")) then return end

local ESX = exports.es_extended:getSharedObject()

if (not ESX) then
    error('\n > Unable to import ESX shared object, please check why this is occuring.\n > This script WILL NOT work until you resolve this.')
    return
end

---Get the player's current bank account balance
---@param src number
---@return integer
local function GetBankBalance(src)
    local xPlayer = ESX.GetPlayerFromId(src)

    if not xPlayer then
        return 0
    end

    return xPlayer.getAccount("bank")?.money or 0
end

---Remove money from a player's bank account
---@param src number
---@param amount number
---@return boolean success
local function RemoveMoney(src, amount)
    local xPlayer = ESX.GetPlayerFromId(src)

    if not xPlayer or amount < 0 then
        return false
    end

    local balance = GetBankBalance(src)

    if (balance < amount) then
        return false
    end

    xPlayer.removeAccountMoney("bank", amount, Locale("REMOVED_MONEY"))

    return true
end

---Add money to a player's bank account
---@param src number
---@param amount number
---@return boolean success
local function AddMoney(src, amount)
    local xPlayer = ESX.GetPlayerFromId(src)

    if not xPlayer or amount < 0 then
        return false
    end

    xPlayer.addAccountMoney("bank", amount, Locale("ADDED_MONEY"))

    return true
end

exports('GetBankBalance', GetBankBalance)
exports('RemoveMoney', RemoveMoney)
exports('AddMoney', AddMoney)
