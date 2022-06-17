export type Select<T extends object> = {
    [P in keyof T]: T[P] extends object
        ? Optional<Select<T[P]>>
        : boolean;
}
type Optional<T> = T | undefined | null; // to be able to specify value below

