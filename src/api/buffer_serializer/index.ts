import _ from 'lodash';

import { BufferSchema } from './types';

class Buffer<T> {
    constructor(public value: T) {}
}

export class BufferSerializer<T = any> {
    constructor(private schema: BufferSchema) {
    }

    fromBuffer(buffer: Buffer<T>): T {
        return buffer.value;
    }

    toBuffer(obj: any) {
        const bufferedEntries = Object
            .entries(this.schema)
            .filter(([key]) => {
                return key !== '__optional';
            })
            .map(([key, type]) => {
                const value = obj[key];
                if(value == null) {
                    if (this.allowEmpty(type)) {
                        return [key, value];
                    } else {
                        throw Error(`Invalid type: ${key}`);
                    }
                }
                return this.BufferEntry(key, type, value);
            }) as [any, any][];

        const bufferValue: T = Object.fromEntries(bufferedEntries);

        return new Buffer<T>(bufferValue);
    }

    private allowEmpty(type: any): boolean {
        if(typeof type === 'string') {
            return type.endsWith('?');
        } else if (_.isArray(type)) {
            const optional = type[1];
            return optional || false;
        } else if (typeof type == 'object') {
            const objSchema: BufferSchema = type;
            return objSchema?.['__optional'] || false;
        } else {
            return false;
        }
    }

    private BufferEntry(key: any, type: any, value: any)  {
        if (typeof type === 'string') {
            if(type.startsWith('string')) {
                const currentType = typeof value;
                if (currentType !== 'string') {
                    throw Error(`Invalid type: ${key}, currentType: ${currentType}`);
                }
                return [key, value];
            } else if (type.startsWith('u32')) {
                const currentType = typeof value;
                if (currentType !== 'number') {
                    throw Error(`Invalid type: ${key}, currentType: ${currentType}`);
                }
                return [key, value];
            } else if (type.startsWith('bool')) {
                const currentType = typeof value;
                if (currentType !== 'boolean') {
                    throw Error(`Invalid type: ${key}, currentType: ${currentType}`);
                }
                return [key, value];
            } else if (type.startsWith('date')) {
                if (!(value instanceof Date)) {
                    throw Error(`Invalid type: ${key}`);
                }
                return [key, value];
            }
        } else if (_.isArray(type)) {
            const innerValueSchema = type[0];
            const innerValueSerializer = new BufferSerializer(innerValueSchema);
            const bufferedValues = value.map((v: string) => this.fromBuffer(innerValueSerializer.toBuffer(v)));
            return [key, bufferedValues];
        } else if (_.isObject(type)) {
            if (typeof value !== 'object') {
                throw Error(`Invalid type: ${key}`);
            }
            const innerValueSerializer = new BufferSerializer(type as BufferSchema);
            const bufferedValue = innerValueSerializer.toBuffer(value);
            return [key, this.fromBuffer(bufferedValue)];
        }
    }
}
