export const logInConsole = (dataToLog: any)=> {
    console.log(JSON.stringify(dataToLog, null, 5));
}

export const getOffset = (page: number, size: number): number => {
    return (page - 1) * size;
  }