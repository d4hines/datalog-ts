import { datalog } from "../src/datalog";
import { expect } from "chai";

describe("Datalog", () => {
    it("Should compute conjunctive queries", () => {
        const facts = [
            ["person", "bob"],
            ["person", "john"],
            ["loves", "bob", "john"]
        ];

        const rules = [
            [["loves", "X", "X"], ["person", "X"]]
        ];

        expect(datalog(rules, facts)).to.have.deep.members([
            ['person', 'bob'],
            ['person', 'john'],
            ['loves', 'bob', 'john'],
            ['loves', 'bob', 'bob'],
            ['loves', 'john', 'john']
        ]);
    });

    it("Should compute recursive queries", () => {
        const facts = [
            ["edge", "a", "b"],
            ["edge", "b", "c"],
            ["edge", "c", "d"]
        ];

        const rules = [
            [["path", "X", "Y"], ["edge", "X", "Y"]],
            [["path", "X", "Z"], ["path", "X", "Y"], ["path", "Y", "Z"]]
        ];

        expect(datalog(rules, facts)).to.have.deep.members([
            ['edge', 'a', 'b'],
            ['edge', 'b', 'c'],
            ['edge', 'c', 'd'],
            ['path', 'a', 'b'],
            ['path', 'b', 'c'],
            ['path', 'c', 'd'],
            ['path', 'a', 'c'],
            ['path', 'b', 'd'],
            ['path', 'a', 'd']
        ]);
    });

    it("Should have stratified negation", () => {
        const facts = [
            ["person", "bob"],
            ["person", "john"],
            ["loves", "bob", "john"]
        ];

        const rules = [
            [["loves", "X", "X"], ["person", "X"]],
            [["not_loved_by_john", "X"], ["person", "X"], ["-", "loves", "john", "X"]]
        ];
        expect(datalog(rules, facts)).to.have.deep.members([
            ['person', 'bob'],
            ['person', 'john'],
            ['loves', 'bob', 'john'],
            ['loves', 'bob', 'bob'],
            ['loves', 'john', 'john'],
            ['not_loved_by_john', 'bob']
        ]);
    });
});
