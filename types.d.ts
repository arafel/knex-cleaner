// Inspiration (and some wording) taken from the DefinitelyTyped project, but not
// a copy.
//
// DT definitions by: Karol Goraus <https://github.com/Szarlus>
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/knex-cleaner/index.d.ts
import { Knex } from 'knex';

declare module '@solarwinter/knex-cleaner' {

    export type KnexCleanerOptions = {
        /**
         * Choose between simply deleting all rows from table or truncating it completely.
         * Default is 'truncate'
         */
        mode?: 'truncate' | 'delete' | undefined;

        /**
         * Tell PostgresSQL to reset the ID counter; default is true.
         */
        restartIdentity?: boolean | undefined;

        /**
         * List of tables to ignore. Empty array by default.
         */
        ignoreTables?: string[] | undefined;
    };

    export function clean(knex: Knex, opts?: KnexCleanerOptions): Promise<void>;
};
