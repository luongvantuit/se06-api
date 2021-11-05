import App from "./providers/App";
import * as cluster from "cluster";
import * as os from "os";
import ProcessEvent from "./app/core/ProcessEvent";

if (cluster.default.isMaster) {
  App.loadConfiguration();

  const CPUS: os.CpuInfo[] = os.cpus();

  CPUS.forEach((value: os.CpuInfo, index: number) => {
    cluster.default.fork();
  });

  ProcessEvent.cluster(cluster.default);
} else {
  App.loadDatabase();

  App.loadServer();
}
