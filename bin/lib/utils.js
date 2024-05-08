import { spawnSync } from 'child_process';
/**
 * @description Wait s seconds
 * @param s - Seconds to wait
 */
export function sleep(s) {
    return new Promise((resolve) => {
        setTimeout(resolve, s * 1000);
    });
}

/**
 * @description Wait s seconds synchronously
 * @param s - Seconds to wait
 */
export function sleepSync(s) {
    spawnSync('sleep', [s]);
}

/**
 * @description Execute curl with a retry mechanism
 * @param params - Param array (as they would be passed to spawnSync)
 * @returns - The result of the curl command
 */
export function curlWithRetry(...params) {
    const result = spawnSync('curl', ...params);

    if (result.error || result.status !== 0) {
        console.error("Error executing curl, retrying in 5 seconds");
        sleepSync(5);
        return curlWithRetry(...params);
    }

    return result;
}
