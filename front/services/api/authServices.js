export const logout = async (processing) => {
    
    const { logout } = useSanctumAuth();
        
    try {
        processing.value = true;
        await logout();
    } catch (error) {
        console.log(error)
    } finally {
        processing.value = false;
    }
}

