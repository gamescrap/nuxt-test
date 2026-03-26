import type { Person } from "#shared/types/person"

export const usePerson = () => {
    const requestFetch = useRequestFetch()
    const { userId, isAuthenticated, handleAuthError, reloadIfUnauthenticated, refreshAndRetry } = useAuth()

    // ─── State ───────────────────────────────────────────────────────────────
    const { data: person } = useAsyncData(
        'person',
        () => {
            if (!userId.value) return Promise.resolve(null)
            return requestFetch<Person>(`/api/persons/${userId.value}`)
        },
        { watch: [isAuthenticated], lazy: true }
    )

    // ─── Getters ───────────────────────────────────────────────────────────────
    const displayName = computed(() => {
        if (person.value?.profile?.firstname) {
            return `${person.value.profile.firstname} ${person.value.profile.lastname}`
        }
        return person.value?.email ?? ''
    })

    // ─── Actions ───────────────────────────────────────────────────────────────
    const fetchPerson = (id: string | string[] | undefined) => {
        const requestFetch = useRequestFetch()

        return useAsyncData(
            `person-${id}`,
            async () => {
                if (!id) return null
                if (await reloadIfUnauthenticated()) return null
                try {
                    return await requestFetch<Person>(`/api/persons/${id}`)
                } catch (e: any) {
                    await handleAuthError(e)
                    return null
                }
            },
            { watch: [isAuthenticated], lazy: true }
        )
    }

    const contactPerson = async (personId: string | string[] | undefined, subject: string, message: string) => {
        if (!personId) return
        const url = `/api/persons/${personId}/contact`
        await refreshAndRetry(() =>
            $fetch(url, {
                method: 'POST',
                body: { subject, message }
            })
        )
    }

    const deleteAccount = async () => {
        const url = `/api/persons/${userId.value}/soft-delete`
        await refreshAndRetry(() =>
            $fetch( url, {
                method: 'PATCH'
            })
        )
    }

    const fetchMyReservations = () => useAsyncData(
        'passenger-reservations',
        async () => {
            if (!userId.value) return []
            if (await reloadIfUnauthenticated()) return []
            try {
                return await requestFetch<ReservationResponse[]>(`/api/persons/${userId.value}/trips-passenger`)
            } catch (e: any) {
                await handleAuthError(e)
                return []
            }
        },
        { watch: [isAuthenticated], lazy: true }
    )

    // ─── Expose ──────────────────────────────────────────────────────────────
    return { person, displayName, contactPerson, deleteAccount, fetchPerson, fetchMyReservations }
}