-- If using a custom framework other then the current supported ones,
-- Set it here, once the bridge folder has been created
local frameworkOveride = false --[[ @as false|string ]]

---Check if the framework is on the server
---@param framework "esx"|"qb"|"qbx"|"standalone"
---@return boolean isStarted
function IsFrameworkStarted(framework)

    if (framework == frameworkOveride) then
        return true
    end

    if (framework == "esx") then
        local state = GetResourceState('es_extended')
        return state == "starting" or state == "started"
    elseif (framework == "qb") then
        local state = GetResourceState('qb-core')
        return state == "starting" or state == "started"
    elseif (framework == "qbx") then
        local state = GetResourceState('qbx-core')
        return state == "starting" or state == "started"
    elseif (framework == "standalone") then
        return true
    end

    warn(("An invalid framework was passed to \"IsFrameworkStarted\": %s"):format(framework))

    return false
end

local localeKey = exports['lb-phone']:GetConfig()?.DefaultLocale or "en"

local jsonLocale = LoadResourceFile('mps-fleecanow', ("%s.json"):format(localeKey))

if (not jsonLocale) then
    warn(('LB Phones DefaultLocale (%s) is not supported by this script, please integrate it in the following file: "@mps-fleecanow/locales/%s.json"'):format(localeKey, localeKey))
    warn('The script will default to the English locale.')
    jsonLocale = LoadResourceFile('mps-fleecanow', "en.json")
end

local bridgeLocale = json.decode(jsonLocale)
if (not bridgeLocale) then
    error('\n > Unable to load locale (%s.json), the file is an invalid json file. Please fix this.')
end

function Locale(key)
    local locale = bridgeLocale?.BRIDGE[key]
    return locale or ("FLEECANOW " .. key)
end
