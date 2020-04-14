import axios from 'axios';

export default class API
{
    static URL_API = 'http://127.0.0.1:8000/api/';
    static instance = null;

    static getInstance()
    {
        return this.instance || new API();
    }

    /**
     * All in one get request for the application
     * Type: GET
     *
     * @returns {Promise} A promise
     */
    GET (path, params = {}, id = null, timeout = 10000)
    {
        return new Promise((resolve, reject) =>
        {
            axios.get(`${API.URL_API}${path}` + (id ? `/${id}` : ``),
                {
                    params: params,
                    timeout
                })
                .then(response =>
                {
                    resolve(response.data);
                })
                .catch(error =>
                {
                    reject(error);
                });
        });
    }

    /**
     * POST request
     * Type: POST
     *
     *
     * @returns {Promise}
     */
    POST(path, data, params = {}, id = null)
    {
        return new Promise((resolve, reject) =>
        {
            axios.post(`${API.URL_API}${path}` + (id ? `/${id}` : ``),
                data,
                {
                    params
                }
            )
                .then(response =>
                {
                    resolve(response);
                })
                .catch(error =>
                {
                    reject(error);
                });
        });
    }

}
