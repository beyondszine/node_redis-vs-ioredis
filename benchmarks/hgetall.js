module.exports = ({ TEST_LEN, TEST_DATA, nodeRedis, ioredis, type, console }) => {
    const redisGetAll = k => new Promise((resolve, reject) => nodeRedis.hgetall(k, (err, data) => err ? reject(err) : resolve(data)));

    return [
        // node_redis hgetall
        async () => {
            console.time('node_redis hgetall');

            let len = TEST_LEN;
            while (len--) {
                await redisGetAll(`node_redis:${type}`);
            }

            console.timeEnd('node_redis hgetall');
        },

        // node_redis hgetall with multi
        async () => {
            console.time('node_redis hgetall with multi');

            let len = TEST_LEN;
            let multi = nodeRedis.multi();
            while (len--) {
                multi.hgetall(`node_redis:${type}`);
            }
            await (new Promise(resolve => {
                multi.exec(resolve);
            }));

            console.timeEnd('node_redis hgetall with multi');
        },

        // ioredis hgetall
        async () => {
            console.time('ioredis hgetall');

            let len = TEST_LEN;
            while (len--) {
                await (ioredis.hgetall(`ioredis:${type}`));
            }

            console.timeEnd('ioredis hgetall');
        },

        // ioredis hgetall with pipeline
        async () => {
            console.time('ioredis hgetall with pipeline');

            let len = TEST_LEN;
            let pipeline = ioredis.pipeline();
            while (len--) {
                pipeline.hgetall(`ioredis:${type}`);
            }
            await (pipeline.exec());

            console.timeEnd('ioredis hgetall with pipeline');
        },

        // ioredis hgetall with multi
        async () => {
            console.time('ioredis hgetall with multi');

            let len = TEST_LEN;
            let multi = ioredis.multi();
            while (len--) {
                multi.hgetall(`ioredis:${type}`);
            }
            await (multi.exec());

            console.timeEnd('ioredis hgetall with multi');
        }
    ];
};
