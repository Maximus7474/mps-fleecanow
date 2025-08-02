if (not IsFrameworkStarted("qbx")) then return end

local OX = exports["ox_core"]

if (not OX) then
    error('\n > Unable to access ox_core exported functions, please check why this is occuring.\n > This script WILL NOT work until you resolve this.')
    return
end

---@param src number
---@return string | nil
function GetIdentifier(src)
    return OX:GetPlayer(src)?.charId
end

---Get the player's current bank account balance
---@param src number
---@return integer
local function GetBankBalance(src)
    local identifier = GetIdentifier(src)

    if not identifier then
        return 0
    end

    local accountId = OX:GetCharacterAccount(identifier)?.accountId

    return accountId and OX:CallAccount(accountId, "get", "balance") or 0
end

---Remove money from a player's bank account
---@param src number
---@param amount number
---@return boolean success
local function RemoveMoney(src, amount)
    local identifier = GetIdentifier(src)

    if not identifier then
        return false
    end

    local accountId = OX:GetCharacterAccount(identifier)?.accountId

    return OX:CallAccount(accountId, "removeBalance", {
        amount = amount,
        message = "Funds added to FleecaNow."
    })?.success or false
end

---Add money to a player's bank account
---@param src number
---@param amount number
---@return boolean success
local function AddMoney(src, amount)
    local identifier = GetIdentifier(src)

    if not identifier then
        return false
    end

    local accountId = OX:GetCharacterAccount(identifier)?.accountId

    return OX:CallAccount(accountId, "addBalance", {
        amount = amount,
        message = "Funds withdrawn from FleecaNow account."
    })?.success or false
end

exports('GetBankBalance', GetBankBalance)
exports('RemoveMoney', RemoveMoney)
exports('AddMoney', AddMoney)
