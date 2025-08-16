--[[ Utility functions ]]

---parse a json file
---@param filePath string
---@param suppressError boolean | nil
---@return table | nil
local function loadJsonFile(filePath, suppressError)
    local content = LoadResourceFile('mps-fleecanow', filePath)
    if not content then
        if not suppressError then
            error(('\n> Unable to load file: ^5%s^7'):format(filePath))
        end
        return nil
    end

    local parsedContent = json.decode(content)
    if not parsedContent and not suppressError then
        error(('\n> Unable to parse content of json file: ^5%s^7'):format(filePath))
        return nil
    end

    return parsedContent
end

local scriptConfig = loadJsonFile('static/config.json')

--[[ Framework functions ]]

---Check if the framework is on the server
---@param framework "ox"|"esx"|"qb"|"qbx"|"custom"
---@return boolean isStarted
function IsFrameworkStarted(framework)
    if (framework == "ox") then
        local state = GetResourceState('ox_core')
        return state == "starting" or state == "started"
    elseif (framework == "esx") then
        local state = GetResourceState('es_extended')
        return state == "starting" or state == "started"
    elseif (framework == "qb") then
        local state = GetResourceState('qb-core')
        return state == "starting" or state == "started"
    elseif (framework == "qbx") then
        local state = GetResourceState('qbx-core')
        return state == "starting" or state == "started"
    elseif (framework == "custom") then
        return true
    end

    warn(("An invalid framework was passed to \"IsFrameworkStarted\": %s"):format(framework))

    return false
end

exports('GetBankBalance', function (...)
    if GetBankBalance then
        GetBankBalance(...)
    else
        error('No "GetBankBalance(...)" function found !\n- Please check your framework file !')
    end
end)
exports('RemoveMoney', function (...)
    if RemoveMoney then
        RemoveMoney(...)
    else
        error('No "RemoveMoney(...)" function found !\n- Please check your framework file !')
    end
end)
exports('AddMoney', function (...)
    if AddMoney then
        AddMoney(...)
    else
        error('No "AddMoney(...)" function found !\n- Please check your framework file !')
    end
end)

--[[ Locale functions ]]

local localeKey = exports['lb-phone']:GetConfig()?.DefaultLocale or "en"
local bridgeLocaleFile = ("locales/%s.json"):format(localeKey)
local bridgeLocale = loadJsonFile(bridgeLocaleFile, true)

if not bridgeLocale then
    warn(('LB Phones DefaultLocale (%s) is not supported by this script, please integrate it in the following file: "@mps-fleecanow/locales/%s.json"'):format(localeKey, localeKey))
    warn('The script will default to the English locale.')
    bridgeLocale = loadJsonFile("locales/en.json")
end
if (not bridgeLocale) then
    error('\n > Unable to load locale (en.json), the file is an invalid json file. Please fix this.')
end

---@param key string
---@return string
function Locale(key)
    local locale = bridgeLocale?.BRIDGE[key]
    return locale or ("FLEECANOW " .. key)
end

--[[ Logging functions ]]

---Return the current setup logging method
---@return string|false
function GetLoggingMethod()
    local raw = scriptConfig?.LoggingMethod or "none"

    if (raw == 'fivemanage' or raw == 'fmsdk') then
        return 'fivemanage'
    elseif (raw == 'discord') then
        return 'discord'
    elseif (raw == 'custom') then
        return 'custom'
    end

    return false
end

exports('Log', function (...)
    if not Log then return end

    Log(...)
end)
