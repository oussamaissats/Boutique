//afficher l'erreur from the backend 

export const getError = (error) => {
    return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
}; 

