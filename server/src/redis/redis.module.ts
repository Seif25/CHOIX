import { DynamicModule, Module, ModuleMetadata, FactoryProvider } from '@nestjs/common';
import IoRedis, { Redis, RedisOptions } from 'ioredis';

export const IO_REDIS_KEY = "IORedis"

type RedisModuleOptions = {
    connectionOptions: RedisOptions;
    onClientReady?: (client: Redis) => void;
}

type AsyncRedisModuleOptions = {
    useFactory: (
        ...args: any[]
    ) => Promise<RedisModuleOptions> | RedisModuleOptions;
} & Pick<ModuleMetadata, 'imports'> &
    Pick<FactoryProvider, 'inject'>

@Module({})
export class RedisModule {
    static async registerAsync({
        useFactory,
        imports,
        inject,
    }: AsyncRedisModuleOptions): Promise<DynamicModule> {
        const redisProvider = {
            provide: IO_REDIS_KEY,
            useFactory: async (...args) => {
                const { connectionOptions, onClientReady } = await useFactory(...args);
                const client = await new IoRedis(connectionOptions);
                onClientReady(client)
                return client;
            },
            inject,
         }
        return {
            module: RedisModule,
            imports,
            providers: [redisProvider],
            exports: [redisProvider],
        }
    }
}