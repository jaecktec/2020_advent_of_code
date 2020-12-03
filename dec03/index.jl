open("input.txt") do f
    lines = map(line -> line, eachline(f))
    function  traverseMap(stepRight, stepDown)
        cnt = 0
        len = length(lines[1])
        for (i, element) in enumerate(lines[1:stepDown:end])
            # fking arrays start at 1 BS
            traverse = stepRight * (i - 1) % len + 1
            if(string(element[traverse]) == "#")
                cnt += 1
            end
        end
        return cnt
    end

    println(traverseMap(3, 1))


    result_2 = Int64[]
    push!(result_2, traverseMap(1, 1))
    push!(result_2, traverseMap(3, 1))
    push!(result_2, traverseMap(5, 1))
    push!(result_2, traverseMap(7, 1))
    push!(result_2, traverseMap(1, 2))

    println(reduce(*, result_2, init=1))

end