import os from 'node:os'

/**
 * Get OS information.
 * @returns {{platform: string, release: string, type: string, arch: string}} OS information.
 */
export function getOSInfo() {
    return {
        platform: os.platform(),
        release: os.release(),
        type: os.type(),
        arch: os.arch(),
    }
}