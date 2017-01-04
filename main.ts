import { Observable, Observer } from "rxjs";
import { load, loadWithFetch, retryStrategy } from "./loader";

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

//let circle = document.getElementById("circle");

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

// function onNext(value) {
//     circle.style.left = value.x;
//     circle.style.right = value.y;
// }

// class MyObservable implements Observer<number> {
//     next(value) {
//         console.log(`value: ${value}`);

//         onNext(value);
//     }

//     error(e) {
//         console.log(`error: ${e}`);
//     }

//     complete() {
//         console.log("complete");
//     }
// }

//source.subscribe(new MyObservable());



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

let subscription = load("movies.json")
    .subscribe(renderMovies, e => console.log(`error: ${e}`), () => console.log("complete"));

subscription.unsubscribe();

click.flatMap(e => loadWithFetch("movies.json"))
    .subscribe(
        renderMovies,
        e => console.log(`error: ${e}`),
        () => console.log("complete")
    );

// let source = Observable.create(observer => {
//     observer.next(1);
//     observer.next(2);
//     observer.error("Stop!");
//     observer.next(3);
//     observer.complete();
// });

// let source = Observable.merge(
//     Observable.of(1),
//     Observable.from([2, 3, 4]),
//     Observable.throw(new Error("Stop!")),
//     Observable.of(5)
// ).catch(e => {
//     console.log(e);
//     return Observable.of(10);
// });

// let source = Observable.onErrorResumeNext(
//     Observable.of(1),
//     Observable.from([2, 3, 4]),
//     Observable.throw(new Error("Stop!")),
//     Observable.of(5)
// );

// source.subscribe(
//     value => console.log(`value: ${value}`),
//     e => console.log(`error: ${e}`),
//     () => console.log("complete")
// );