import { AsyncQueue } from '../api/async_queue';

describe('Async Queue', () => {
    it('numbers should be sequenced', async () => {
        const task = async <T>(value: T) => {
            await new Promise((r) => setTimeout(r, 100 * Math.random()));
            return value;
        };
        const queue = new AsyncQueue();
        const results  = await Promise.all([
            queue.add(() => task(1)),
            queue.add(() => task(2)),
            queue.add(() => task(3)),
            queue.add(() => task(4)),
        ]);

        expect(results).toEqual([1,2,3,4]);
    });
});
