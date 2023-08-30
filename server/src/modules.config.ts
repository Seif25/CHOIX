import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "./redis.module";
import { JwtModule } from "@nestjs/jwt";

export const redisModule = RedisModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
        const logger = new Logger("RedisModule")
        logger.log("Connecting to Redis...")

        return {
            connectionOptions: {
                host: configService.get("REDIS_HOST"),
                port: configService.get("REDIS_PORT"),
            },
            onClientReady: (client) => {
                logger.log("Redis Client Ready!")

                client.on("error", (err) => {
                    logger.error("Redis error: " + err)
                })

                client.on("connect", () => {
                    logger.log(
                        `Connected to Redis on ${client.options.host}:${client.options.port}`
                    )
                })
            }
        }
    },
    inject: [ConfigService],
})

export const JWTModule = JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
            expiresIn: parseInt(configService.get<string>("POLL_DURATION")),
        }
    }),
    inject: [ConfigService],
})