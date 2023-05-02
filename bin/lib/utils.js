/**
 * @description Wait s seconds
 * @param s - Seconds to wait
 */
export function sleep(s) {
    return new Promise((resolve) => {
        setTimeout(resolve, s * 1000);
    });
}