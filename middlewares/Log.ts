class Log {
    public static default(message: any): void {
        console.log(message);
    }

    public static error(message: any): void {
        console.error(message);
    }
    public static warn(message: any): void {
        console.warn(message);
    }

}

export default Log;
