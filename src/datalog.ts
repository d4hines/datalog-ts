import * as R from "rambda";

// Substitutions, implemented as JS objects where keys and values are both strings
type Subst = { [k: string]: string };

type Tuple = string[];

const is_var = (s: any): s is string => typeof s === "string" && s[0].toUpperCase() === s[0];
const is_negated = (t: Tuple) => t[0] === "-";


const assign = (subst: Subst, key: string, value: string) => {
    if (!(key in subst)) {
        return { ...subst, [key]: value };
    } else if (subst[key] === value) {
        return subst;
    } else {
        return false;
    }
}

const substitute = ([pred, ...args]: string[], subst: Subst) => {
    return [pred, ...args.map(x => (x in subst) ? subst[x] : x)];
}

// Returns false on unification failure.
const unify = (subst: Subst, args: string[] | string, grounds: string[] | string): Subst | false => {
    console.log("unifying:", subst, args, grounds);
    if (R.equals(args, grounds)) {
        return subst;
    } else if (is_var(args)) {
        return assign(subst, args, grounds as string);
    } else if (
        Array.isArray(args)
        && args.length
        && Array.isArray(grounds)
        && grounds.length
    ) {
        const x = unify(subst, R.head(args) as string, R.head(grounds) as string);
        if (x === false) {
            return false;
        } else {
            return unify(x, R.tail(args), R.tail(grounds));
        }
    } else {
        return false;
    }
}

const query = (conc: string[], premises: string[][], facts: string[][], subst: Subst = {}): string[][] => {
    if (premises.length === 0) {
        return [substitute(conc, subst)];
    } else {
        const [[pred, ...args], ...prems] = premises;
        return facts.filter(fact => R.head(fact) === pred)
            .map(fact => {
                const new_subst = unify(subst, args, R.tail(fact));
                if (new_subst) {
                    return query(conc, prems, facts, new_subst);
                } else {
                    return []
                }
            }).reduce(R.union);
    }
}

const step = (rules: string[][][], facts: string[][]) => {
    for (const [conclusion, ...premises] of rules) {
        const [negated_prems, positive_prems] = R.partition(is_negated, premises);
        const positive_facts = query(conclusion, positive_prems, facts);
        const negative_facts = negated_prems.length
            ? query(conclusion, negated_prems.map(prem => R.drop(1, prem)), facts)
            : [];
        facts = R.union(facts, R.difference(positive_facts, negative_facts));
    }
    return facts;
}

export const datalog = (rules: string[][][], facts: string[][]): string[][] => {
    const newFacts = step(rules, facts);
    console.log("facts", facts);
    console.log("new facts", newFacts);
    if (R.equals(facts, newFacts)) {
        return facts;
    } else {
        return datalog(rules, newFacts);
    }
}
