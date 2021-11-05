import * as cluster from "cluster";
import Log from "../../middlewares/Log";

class ProcessEvent {
  public cluster(_cluster: cluster.Cluster): void {
    _cluster.on("online", (worker: cluster.Worker) => {
      Log.default(
        `Cluster run process! State online :: PID ${worker.process.pid}`
      );
    });

    _cluster.on("exit", (worker: cluster.Worker) => {
      Log.default(
        `Cluster exit process! State exit :: PID ${worker.process.pid}`
      );
      _cluster.fork();
    });
  }
}

export default new ProcessEvent();
