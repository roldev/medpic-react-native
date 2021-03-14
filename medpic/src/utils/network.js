
export function buildUrlWithQueryParams(baseUrl, queryParams) {
    let queryParamsKeys = Object.keys(queryParams);

    const firstQueryParamKey = queryParamsKeys.shift();
    let finalUrl = `${baseUrl}?${firstQueryParamKey}=${encodeURI(queryParams[firstQueryParamKey])}`;

    finalUrl = queryParamsKeys.reduce((final, currentParam) => {
        return `${final}&${currentParam}=${encodeURI(queryParams[currentParam])}`;
    }, finalUrl);

    return finalUrl
}