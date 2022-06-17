import { BufferSerializer } from '../api/buffer_serializer';
import { BufferSchema } from '../api/buffer_serializer/types';

describe('Buffer Serializer', () => {
    it('should return serialized user', async () => {
        const userSchema: BufferSchema = {
            id: 'string',
            age: 'u32',
            location: {
                country: 'string?' as any,
                __optional: true
            },
            posts: [{
                id: 'string',
                text: 'string',
                createAt: 'date',
                draft: 'bool'
            }]
        }

        const serializer = new BufferSerializer(userSchema);
        const createAt = new Date();

        const buffer = serializer.toBuffer({
            id: 'u1',
            age: 30,
            posts: [
                {
                    id: 'p1',
                    text: 'post1',
                    createAt,
                    draft: true
                },
                {
                    id: 'p2',
                    text: 'post2',
                    createAt,
                    draft: false
                },
            ]
        });

        const user = serializer.fromBuffer(buffer);


        expect(user).toEqual( {
            id: 'u1',
            age: 30,
            location: undefined,
            posts: [
                { id: 'p1', text: 'post1', draft: true, createAt },
                { id: 'p2', text: 'post2', draft: false, createAt }
            ]
        });
    });
});