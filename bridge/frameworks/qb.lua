if (not IsFrameworkStarted("qb")) then return end

local QB = exports["qb-core"]:GetCoreObject()

if (not QB) then
    error('\n > Unable to import QB core object, please check why this is occuring.\n > This script WILL NOT work until you resolve this.')
    return
end

---Get the player's current bank account balance
---@param src number
---@return integer
function GetBankBalance(src)
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
function RemoveMoney(src, amount)
    local qPlayer = QB.Functions.GetPlayer(tonumber(src))

    if not qPlayer then
        return false
    end

    qPlayer.Functions.RemoveMoney("bank", amount, Locale("REMOVED_MONEY"))

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
function AddMoney(src, amount)
    local qPlayer = QB.Functions.GetPlayer(tonumber(src))

    if not qPlayer or amount < 0 then
        return false
    end

    qPlayer.Functions.AddMoney("bank", amount, Locale("ADDED_MONEY"))

    return true
end

exports('GetBankBalance', GetBankBalance)
exports('RemoveMoney', RemoveMoney)
exports('AddMoney', AddMoney)
