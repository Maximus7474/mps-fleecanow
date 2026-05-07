if (not IsFrameworkStarted("qbx")) then return end

---Get the player's current bank account balance
---@param src number
---@return integer
function GetBankBalance(src)
    local amount = exports.qbx_core:GetMoney(src, 'bank')

    return amount or 0
end

---Remove money from a player's bank account
---@param src number
---@param amount number
---@return boolean success
function RemoveMoney(src, amount)
    local result = exports.qbx_core:RemoveMoney(src, 'bank', amount, Locale("REMOVED_MONEY"))

    return result
end

---Add money to a player's bank account
---@param src number
---@param amount number
---@return boolean success
function AddMoney(src, amount)
    local result = exports.qbx_core:RemoveMoney(src, 'bank', amount, Locale("ADDED_MONEY"))

    return result
end

exports('GetBankBalance', GetBankBalance)
exports('RemoveMoney', RemoveMoney)
exports('AddMoney', AddMoney)

print('Registered qbox bridge')
