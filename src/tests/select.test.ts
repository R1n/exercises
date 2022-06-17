import { Select } from '../api/select';

describe('Select', () => {
    it('should be converted to bool', async () => {
        type User = {
            id: string;
            name: string;
            posts: Post[];
        }

        type Post = {
            id: string;
            text: string;
            user: User;
        }

        const userSelect: Select<User> = {
            id: true,
            name: true,
            posts: null
        }

        const postSelect: Select<Post> = {
            id: true,
            text: true,
            user: {
                id: true,
                name: true,
                posts: null,
            }
        }

        expect(userSelect).toEqual({
            id: true,
            name: true,
            posts: null
        });

        expect(postSelect).toEqual({
            id: true,
            text: true,
            user: {
                id: true,
                name: true,
                posts: null,
            }
        });
    });
});