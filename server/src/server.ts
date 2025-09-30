import app from './app';
import { env } from './configs/env';
import { initData } from './init/data.init';

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
    // init data
    initData();
});
