export const useAddressSearch = () => {
    const cityQuery = ref('')
    const addressQuery = ref('')
    const selectedCity = ref<City | null>(null)
    const selectedAddress = ref<Address | null>(null)
    const citySuggestions = ref<City[]>([])
    const addressSuggestions = ref<Address[]>([])
    const loadingCities = ref(false)
    const loadingAddresses = ref(false)

    let cityTimer: ReturnType<typeof setTimeout>
    let addressTimer: ReturnType<typeof setTimeout>

    const fetchWithRefresh = async <T>(url: string, params: Record<string, string>): Promise<T> => {
        try {
            return await $fetch<T>(url, { params })
        } catch (e: any) {
            if (e?.status === 401) {
                const refreshed = await $fetch<AuthResponse>('/api/auth/refresh', {
                    method: 'POST',
                    ignoreResponseError: true
                })
                if (refreshed?.userId) {
                    const { storeSession } = useAuth()
                    storeSession(refreshed)
                    return await $fetch<T>(url, { params })
                }
            }
            throw e
        }
    }

    const searchCities = (query: string) => {
        selectedCity.value = null
        selectedAddress.value = null
        addressQuery.value = ''
        addressSuggestions.value = []

        clearTimeout(cityTimer)
        if (query.length < 2) { citySuggestions.value = []; return }
        cityTimer = setTimeout(async () => {
            loadingCities.value = true
            try {
                citySuggestions.value = await fetchWithRefresh<City[]>('/api/cities/search', { name: query })
            } finally {
                loadingCities.value = false
            }
        }, 1000)
    }

    const searchAddresses = (query: string) => {
        selectedAddress.value = null

        clearTimeout(addressTimer)
        if (!selectedCity.value || query.length < 3) { addressSuggestions.value = []; return }
        addressTimer = setTimeout(async () => {
            loadingAddresses.value = true
            try {
                addressSuggestions.value = await fetchWithRefresh<Address[]>('/api/addresses/search', {
                    city: selectedCity.value!.name,
                    q: query
                })
            } finally {
                loadingAddresses.value = false
            }
        }, 1000)
    }

    const selectCity = (city: City) => {
        selectedCity.value = city
        cityQuery.value = `${city.name} (${city.postalCode})`
        citySuggestions.value = []
        addressQuery.value = ''
        selectedAddress.value = null
    }

    const selectAddress = (address: Address) => {
        selectedAddress.value = address
        addressQuery.value = `${address.streetNumber} ${address.streetName}`
        addressSuggestions.value = []
    }

    const reset = () => {
        cityQuery.value = ''
        addressQuery.value = ''
        selectedCity.value = null
        selectedAddress.value = null
        citySuggestions.value = []
        addressSuggestions.value = []
    }

    return {
        cityQuery, addressQuery,
        selectedCity, selectedAddress,
        citySuggestions, addressSuggestions,
        loadingCities, loadingAddresses,
        searchCities, searchAddresses,
        selectCity, selectAddress, reset
    }
}