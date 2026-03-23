import type { Person } from "#shared/types/person"

export const usePerson = () => {
    const requestFetch = useRequestFetch()
    const { userId, isAuthenticated } = useAuth()

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
        const { isAuthenticated, reloadIfUnauthenticated, handleAuthError } = useAuth()
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

    const deleteAccount = async () => {
        await $fetch(`/api/persons/${userId.value}/soft-delete`, { method: 'PATCH' })
    }

    // ─── Expose ──────────────────────────────────────────────────────────────
    return { person, displayName, deleteAccount, fetchPerson }
}