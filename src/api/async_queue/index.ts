export type Action<T> = (() => Promise<T>);

export class AsyncQueue<T, E> {
    inProgress = 0;

    queue: {
        action: Action<T>;
        resolve: (t: T) => void;
        reject: (err: E) => void;
    }[] = [];


    add(t: Action<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.queue.push({
                action: t,
                resolve,
                reject,
            });
            this.startQueuedItem();
        });
    }

    private startQueuedItem(): void {
        const item = this.queue.shift();
        if (item === undefined) {
            return;
        }
        this.inProgress += 1;
        item.action()
            .then((val: T) => {
                item.resolve(val);
            })
            .catch((err) => {
                item.reject(err);
            })
            .finally(() => {
                this.inProgress -= 1;
                this.startQueuedItem();
            });
    }
}