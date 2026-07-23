/**
 * @typedef {Object} DsplayConfig
 * @property {'landscape'|'portrait'} orientation - Screen orientation
 * @property {number} width - Screen width of device
 * @property {number} height - Screen height of device
 * @property {string} os - Operating system (for future use)
 * @property {number} osVersion - Android SDK version
 * @property {number} appVersion - DSPLAY App version code
 * @property {string} appVersionName - DSPLAY App version name
 * @property {string} locale - Current locale
 */

/**
 * @typedef {Object} DsplayMediaBase
 * @property {number} id - Media ID
 * @property {string} name - Media name
 * @property {number} count - Internal counter: how many media items were played until this point
 * @property {number} iteration - Internal counter: how many times this particular media was played
 * @property {number} duration - Media duration in milliseconds
 */

/**
 * Media object made available to the template. Besides the base fields above,
 * it may contain additional type-specific fields depending on the media type
 * configured in the CMS.
 * @typedef {DsplayMediaBase & Record<string, *>} DsplayMedia
 */

/**
 * Template variables object. Its fields are entirely defined by the template
 * creator through the variable registration in the CMS, so there are no
 * fixed keys.
 * @typedef {Record<string, string>} DsplayTemplate
 */

/**
 * @typedef {Object} DsplayData
 * @property {DsplayMedia} media
 * @property {DsplayConfig} config
 * @property {DsplayTemplate} template
 */

/**
 * @typedef {Object} DSplayInterface
 * @property {(message: string) => void} error - Reports an error to the DSPLAY app
 * @property {() => void} complete - Notifies the DSPLAY app that the media playback is complete
 * @property {() => string} getData - Returns the JSON-stringified {@link DsplayData}
 */

export {};
