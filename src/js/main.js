const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

axios.interceptors.request.use(function (config) {
    config.headers.Authorization = 'Bearer Token'
    // config.data = {
    //     first_name: 'Jhon'
    // }
    console.log(config)

    return config
}, function (error) {
    console.log(error.response)

    return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
    // Qualquer código de status que dentro do limite de 2xx faz com que está função seja acionada
    // Faz alguma coisa com os dados de resposta
    console.log('Success!')
    return response;
  }, function (error) {
    // Qualquer código de status que não esteja no limite do código 2xx faz com que está função seja acionada
    // Faz alguma coisa com o erro da resposta
    console.log('Error');
    return Promise.reject(error);
  });

const get = () => {
    const config = {
        params: {
            _limit: 5
        }
    }
    axios.get('https://jsonplaceholder.typicode.com/posts', config)
        .then((response) => renderOutput(response))
}

const post = () => {
    const data = {
        title: 'My first Post Axios Request',
        body: 'Lorem ipsum dollor sit amet',
        userId: 1
    }
    axios.post('https://jsonplaceholder.typicode.com/posts', data)
        .then((response) => renderOutput(response))
}

const put = () => {
    const data = {
        title: 'UPDATED',
        body: 'Lorem ipsum dollor sit amet UPDATED',
        userId: 1
    }
    axios.put('https://jsonplaceholder.typicode.com/posts/1', data)
        .then((response) => renderOutput(response))
}

const patch = () => {
    const data = {
        title: 'UPDATED PATCH',        
    }
    axios.patch('https://jsonplaceholder.typicode.com/posts/1', data)
        .then((response) => renderOutput(response))
}

const del = () => {
    axios.delete('https://jsonplaceholder.typicode.com/posts/1')
        .then((response) => renderOutput(response))
}

const multiple = () => {
    Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/posts'),
        axios.get('https://jsonplaceholder.typicode.com/users')
    ]).then((response) => {
        console.table(response[0].data);
        console.table(response[1].data);
    })
}

const transform = () => {
    const config = {
        params: {
            _limit: 5
        },
        transformResponse: [function (data) {
            const payload = JSON.parse(data).map( xpto => {
                return {
                    ...xpto,
                    first_name: 'Jhon',
                    last_name: 'Doe',
                    full_name: 'Jhon Doe'
                }
            })

            return payload
        }]
    }
    axios.get('https://jsonplaceholder.typicode.com/posts', config)
        .then((response) => renderOutput(response))
}

const errorHandling = () => {
    axios.get('https://jsonplaceholder.typicode.com/postsz')
        .then((response) => renderOutput(response))
        .catch((error) => renderOutput(error.response))
        // .catch((error) => {
        //     renderOutput(error.response)
        //     console.log(error.response.data)
        //     console.log(error.response.status)
        //     console.log(error.response.headers)
        // })
}

const cancel = () => {
    const CancelToken = axios.CancelToken;
    let cancel
    const config = {
        params: {
            _limit: 5
        },
        cancelToken: new CancelToken(function executor(c) {
            // Uma função executora recebe uma função de cancelamento como parametro
            cancel = c;
        })
    }
    axios.get('https://jsonplaceholder.typicode.com/posts', config)
        .then((response) => renderOutput(response))
        .catch((error) => {
            console.log(error.message);
        })
    
    cancel()
}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
