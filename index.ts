import App from "./providers/App";
import * as cluster from 'cluster';
import * as os from 'os'
import NativeEvent from "./app/Core/NativeEvent";

if (cluster.default.isMaster) {

    App.loadConfiguration();

    const CPUS: os.CpuInfo[] = os.cpus();

    CPUS.forEach((value: os.CpuInfo, index: number) => {
        cluster.default.fork();
    })

    NativeEvent.cluster(cluster.default);

} else {

    App.loadDatabase();

    App.loadServer();
}
