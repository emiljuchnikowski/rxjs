import { Observable, Observer } from "rxjs";

// Importing Just What We Need
// import {Observable} from "rxjs/Observable";
// import {Observer} from "rxjs/Observer";
// import "rxjs/add/operator/map";
// import "rxjs/add/operator/filter";

//let numbers = [1, 5, 10];

// let source = Observable.from(numbers);

// let source = Observable.create(observer => {

//     for (let n of numbers) {
//         // if (n === 5) {
//         //     observer.error("Somphing went wrong!");
//         // }

//         observer.next(n);
//     }

//     observer.complete();

// });

// source.subscribe(
//     value => console.log(`value: ${value}`),
//     e => console.log(`error: ${e}`),
//     () => console.log("complete")
// );

// let source = Observable.create(observer => {

//     let index = 0;
//     let produceValue = () => {
//         observer.next(numbers[index++]);

//         if (index < numbers.length) {
//             setTimeout(produceValue, 2000);
//         } else {
//             observer.complete();
//         }
//     }

//     produceValue();

// }).map(n => n * 2)
//     .filter(n => n > 4);

let circle = document.getElementById("circle");

let output = document.getElementById("output");
let button = document.getElementById("button");

// let source = Observable.fromEvent(document, "mousemove")
//     .map((e: MouseEvent) => {
//         return {
//             x: e.clientX,
//             y: e.clientY
//         };
//     })
//     .filter(value => value.x < 500)
//     .delay(300);

let click = Observable.fromEvent(button, "click");

function onNext(value) {
    circle.style.left = value.x;
    circle.style.right = value.y;
}

class MyObservable implements Observer<number> {
    next(value) {
        console.log(`value: ${value}`);

        onNext(value);
    }

    error(e) {
        console.log(`error: ${e}`);
    }

    complete() {
        console.log("complete");
    }
}

//source.subscribe(new MyObservable());

function load(url: string) {
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

function loadWithFetch(url: string) {
    return Observable.defer(() => {
        return Observable.fromPromise(fetch(url).then(r => r.json()));
    });
    //return Observable.fromPromise(fetch(url).then(r => r.json()));
}

function retryStrategy({ attempts = 4, delay = 1000 }) {
    return function (errors) {
        return errors
            .scan((acc, value) => {
                console.log(acc, value);
                return acc + 1;
            }, 10)
            .taheWhile(acc => acc < attempts)
            .delay(delay);
    }
}

function renderMovies(movies) {
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}

// click.subscribe(
//     e => load("movies.json"),
//     e => console.log(`error: ${e}`),
//     () => console.log("complete")
// );

//load("movies.json").subscribe(renderMovies);

click.flatMap(e => loadWithFetch("movies.json"))
    .subscribe(
        renderMovies,
        e => console.log(`error: ${e}`),
        () => console.log("complete")
    );