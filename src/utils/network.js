
export function objectToFormData(body) {
    const formData = new FormData();

    for(const key in body) {
        formData.append(key, body[key]);
    }

    return formData;
}