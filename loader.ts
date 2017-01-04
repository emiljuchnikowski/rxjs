import { Observable } from "rxjs";

export function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("load", () => {
            let data = JSON.parse(xhr.responseText);
            observer.next(data);
            observer.complete();
        });

        xhr.open("GET", url);
        xhr.send();
    })
    //.retry(3)
    .retryWhen(retryStrategy({ attempts: 3, delay: 1500 }));
}

export function loadWithFetch(url: string) {
    return Observable.defer(() => {
        return Observable.fromPromise(
            fetch(url).then(r => {
                if (r.status === 200) {
                    return r.json();
                } else {
                    return Promise.reject(r);
                }
            })
        ).retryWhen(retryStrategy());
    });
    //return Observable.fromPromise(fetch(url).then(r => r.json()));
}

export function retryStrategy({ attempts = 4, delay = 1000 } = {}) {
    return function (errors) {
        return errors
            .scan((acc, value) => {
                acc += 1;

                if(acc < attempts) {
                    return acc;
                } else {
                    throw new Error(value);
                }
            }, 10)
            //.taheWhile(acc => acc < attempts)
            .delay(delay);
    }
}