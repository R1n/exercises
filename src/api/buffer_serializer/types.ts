type OrOptional<T extends string> = T
export type BufferValueType =
    | OrOptional<'string'>
    | OrOptional<'u32'>
    | OrOptional<'bool'>
    | OrOptional<'date'>

export type BufferSchemaType =
    | BufferValueType
    | BufferSchema
    | [BufferSchema, string?]
    | [BufferSchema, boolean?]
    | (boolean | undefined)

export type BufferSchema = {
    ['__optional']?: boolean,
    [k: string]: BufferSchemaType
}