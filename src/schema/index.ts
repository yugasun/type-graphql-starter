import {
    Field,
    InputType, ObjectType, InterfaceType, createUnionType,
    Resolver, Query, Mutation, Arg,
    buildSchema,
} from 'type-graphql';
import { getId, getToken } from './helpers';

@ObjectType()
class Pin {
    @Field()
    title: string;

    @Field()
    link: string;

    @Field()
    image: string;

    @Field()
    id: string;

    @Field()
    user_id: string;
}

@InputType()
class PinInput {
    @Field()
    title: string;

    @Field()
    link: string;

    @Field()
    image: string;
}

@InterfaceType()
abstract class Person {
    @Field()
    id: string;

    @Field()
    email: string;

    @Field(type => [Pin])
    pins: Pin[]
}

@ObjectType({ implements: Person })
class User implements Person {
    id: string;
    email: string;
    pins: Pin[];
}

@ObjectType({ implements: Person })
class Admin implements Person {
    id: string;
    email: string;
    pins: Pin[];
}

const SearchResult = createUnionType({
    name: "SearchResult",
    types: [User, Admin, Pin]
})

@Resolver()
class ApiResolver {
    private pins: Pin[];
    private users: User[];
    private me: User;

    @Query(returns => Pin)
    async pinById(@Arg('id') id: string): Promise<Pin> {
        const pins = this.pins.filter(p => p.id === id);
        return pins[0];
    }

    @Query(returns => [SearchResult])
    async search(text: string): Promise<Array<typeof SearchResult>> {
        const users = this.users.filter(u => u.email.indexOf(text) !== -1);
        const pins = this.pins.filter(p => p.title.indexOf(text) !== -1);
        const admins = this.me.email.indexOf(text) !== -1 ? [this.me] : [];
        return [...admins, ...users, ...pins];
    }

    @Mutation()
    addPin(pin: PinInput): Pin {
        const p = {
            ...pin,
            id: getId(),
            user_id: this.me.id,
        }
        this.pins.push(p);
        return p;
    }

    @Mutation()
    sendShortLivedToken(email: string): boolean {
        return true;
    }

    @Mutation()
    createLongLivedToken(token: string): string {
        return getToken();
    }
}

export default async () => {
    return buildSchema({
        resolvers: [ApiResolver],
    });
};