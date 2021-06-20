/**
 * this is a mock of natswapper within base-publisher.ts. For use in automated tests
 */
export const natsWrapper = { 
    client:  { 
        publish: jest
        .fn()
        .mockImplementation(
            (subject: string, data: string, callback: () => void) => {
                callback()
            }
        )

    }   
}
