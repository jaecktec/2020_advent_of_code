open("input.txt") do f

    reduce_1 = function (numValid::Int, it::String)
        r = match(r"(\d*)-(\d*)\s(\S):\s([a-z]*)", it)
        from = parse(Int,r[1])
        to = parse(Int,r[2])
        char = r[3]
        str = r[4]

        count_characters = function(characterCount::Int, character::Char)
            if string(character) == char
                return characterCount + 1
            else
                return characterCount
            end
        end
        
        counted_characters = reduce(count_characters, str, init=0)
        if from <= counted_characters && counted_characters <= to
            return 1 + numValid
        else
            return numValid
        end
    end

    reduce_2 = function (numValid::Int, it::String)
        r = match(r"(\d*)-(\d*)\s(\S):\s([a-z]*)", it)
        from = parse(Int,r[1])
        to = parse(Int,r[2])
        char = string(r[3])
        str = r[4]
        
        if xor(string(str[from]) == char, string(str[to]) == char)
            return 1 + numValid
        else
            return numValid
        end
    end


    values = map(l -> l, eachline(f))
    println(reduce(reduce_1, values, init = 0))
    println(reduce(reduce_2, values, init = 0))
end