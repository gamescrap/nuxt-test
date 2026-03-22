import type {Person} from "#shared/types/person";

export const usePerson = () => {
    const requestFetch = useRequestFetch()
    const { userId } = useAuth()

    const { data: person } = useAsyncData(
        'person',
        () => {
            if (!userId.value) return Promise.resolve(null)
            return requestFetch<Person>(`/api/persons/${userId.value}`)
        }
    )

    const displayName = computed(() => {
        if (person.value?.profile?.firstname) {
            return `${person.value.profile.firstname} ${person.value.profile.lastname}`
        }
        return person.value?.email ?? ''
    })

    return { person, displayName }
}