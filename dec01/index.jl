open("input.txt") do f
    values = Int[]
    for l in eachline(f)
        push!(values, parse(Int,l))
    end

    function calculateStep1()
        for ra in values
            for rb in values
                if (ra + rb) == 2020
                    println("$(ra) + $(rb) == 2020, => $(ra) * $(rb) = $(ra * rb)")
                    return
                end
            end
        end
    end

    function calculateStep2()
        for ra in values
            for rb in values
                for rc in values
                    if (ra + rb + rc) == 2020
                        println("$(ra) + $(rb) + $(rc) == 2020, => $(ra) * $(rb) * $(rc) = $(ra * rb * rc)")
                        return
                    end
                end

            end
        end
    end



    calculateStep1()
    calculateStep2()
end