class Log {
    public default(message: any): void {
        console.log(message);
    }
}

export default new Log;